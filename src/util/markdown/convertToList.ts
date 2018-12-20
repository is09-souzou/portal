export default (element: HTMLInputElement | HTMLTextAreaElement, lines: number[]): [string, number] => {
    let adjustmentCount = 0;
    const value = element.value.split("\n")
        .map((x: string, i: number) => {
            if (i + 1 >= lines[0] && i + 1 <= lines[1]) {
                if (/^([*]|-) /.test(x)) {
                    adjustmentCount = adjustmentCount - 2;
                    return x.replace(/^../g, "");
                }
                adjustmentCount = adjustmentCount + 2;
                return x.replace(/^/g, "* ");
            }
            return x;
        })
        .join("\n");
    return ([value, adjustmentCount]);
};
