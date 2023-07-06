export class Lock {
  private _value = false;
  private _callbacks: ((lock: boolean) => void)[] = [];

  public get() {
    return this._value;
  }

  public subscribe(cb: (lock: boolean) => void) {
    this._callbacks.push(cb);

    cb(this.get());
  }

  public set(lock: boolean) {
    this._value = lock;

    this._callbacks.forEach((cb) => {
      cb(this.get());
    });
  }
}

export async function waitForLock(lock: Lock) {
  if (!lock.get()) return true;

  return new Promise((resolve) => {
    lock.subscribe((v) => {
      if (!v) resolve(true);
    });
  });
}
