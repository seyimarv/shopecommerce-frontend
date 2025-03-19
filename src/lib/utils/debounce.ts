/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-this-alias */
export function debounce<T extends (...args: any[]) => void>(
    func: T,
    delay: number = 300
): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | undefined;

    return function (this: any, ...args: Parameters<T>) {
        const context = this;

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}