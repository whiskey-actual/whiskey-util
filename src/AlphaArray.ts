export function getAlphaArray():string[] {
    const alpha:number[] = Array.from(Array(26)).map((e, i) => i + 65);
    const alphabet:string[] = alpha.map((x) => String.fromCharCode(x));
    return alphabet
}
