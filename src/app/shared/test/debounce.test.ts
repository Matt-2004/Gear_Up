import { debounce } from "../utils/debounce";

describe("debounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should not call the callback immediately", () => {
    const callback = jest.fn();

    const debouncedFn = debounce(callback, 400);

    debouncedFn("hello");

    expect(callback).not.toHaveBeenCalled();
  });

  it("should call the callback after the delay", () => {
    const callback = jest.fn();

    const debouncedFn = debounce(callback, 400);

    debouncedFn("hello");

    jest.advanceTimersByTime(400);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("hello");
  });

  it("should reset the timer if called again before delay finishes", () => {
    const callback = jest.fn();

    const debouncedFn = debounce(callback, 400);

    debouncedFn("first");

    jest.advanceTimersByTime(200);

    debouncedFn("second");

    jest.advanceTimersByTime(200);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(200);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("second");
  });

  it("should only call the callback with the latest value", () => {
    const callback = jest.fn();

    const debouncedFn = debounce(callback, 400);

    debouncedFn("a");
    debouncedFn("ab");
    debouncedFn("abc");

    jest.advanceTimersByTime(400);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("abc");
  });

  it("should support multiple arguments", () => {
    const callback = jest.fn();

    const debouncedFn = debounce((name: string, age: number) => {
      callback(name, age);
    }, 400);

    debouncedFn("Mg Mg", 20);

    jest.advanceTimersByTime(400);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("Mg Mg", 20);
  });

  it("should use default delay when delay is not provided", () => {
    const callback = jest.fn();

    const debouncedFn = debounce(callback);

    debouncedFn("default delay");

    jest.advanceTimersByTime(399);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("default delay");
  });
});
