import { useEffect } from "react";

function smoothScroll(element, target, duration) {
  target = Math.round(target);
  duration = Math.round(duration);
  if (duration < 0) {
    return Promise.reject("bad duration");
  }
  if (duration === 0) {
    element.scrollTop = target;
    return Promise.resolve();
  }

  const start_time = Date.now();
  const end_time = start_time + duration;

  const start_top = element.scrollTop;
  const distance = target - start_top;

  const smooth_step = function (start, end, point) {
    if (point <= start) {
      return 0;
    }
    if (point >= end) {
      return 1;
    }
    const x = (point - start) / (end - start);
    return x * x * (3 - 2 * x);
  };

  return new Promise<void>(function (resolve) {
    const scroll_frame = function () {
      const now = Date.now();
      const point = smooth_step(start_time, end_time, now);
      const frameTop = Math.round(start_top + distance * point);
      element.scrollTop = frameTop;

      if (now >= end_time) {
        resolve();
        return;
      }

      if (element.scrollTop === frameTop) {
        setTimeout(scroll_frame, 0);
      }
    };
    setTimeout(scroll_frame, 0);
  });
}

export function useAutoScroll(messages, dependencies: any[], ref) {
  useEffect(() => {
    if (ref.current) {
      smoothScroll(ref.current, ref.current.scrollHeight, 500);
    }
  }, [messages, ...dependencies, ref]);
}
