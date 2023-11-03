import { tryParse } from 'be-enhanced/cpu.js';
const reOfExportingStatement = [
    {
        regExp: new RegExp(String.raw `^(?<eventName>[\w])`),
        defaultVals: {}
    }
];
export function prsOf(self) {
    const { Of, of } = self;
    const both = [...(Of || []), ...(of || [])];
    const exportingRules = [];
    for (const ofStatement of both) {
        const test = tryParse(ofStatement, reOfExportingStatement);
        if (test === null)
            throw 'PE';
        const { eventName } = test;
        exportingRules.push(test);
    }
    return exportingRules;
}
