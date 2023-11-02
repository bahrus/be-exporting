import {AP, ProPAP, PAP, ExportingRule} from './types';
import {RegExpOrRegExpExt} from 'be-enhanced/types';
import {arr, tryParse} from 'be-enhanced/cpu.js';

export function prsOf(self: AP) : Array<ExportingRule> {
    const {Of, of} = self;
    const both = [...(Of || []), ...(of || [])];
    const exportingRules: Array<ExportingRule> = [];
    return exportingRules;
}