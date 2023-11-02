import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA, ExportingRule} from './types';
import {register} from 'be-hive/register.js';

export class BeExporting extends BE<AP, Actions> implements Actions{
    static override get beConfig(){
        return {
            parse: true,
            parseAndCamelize: true,
            isParsedProp: 'isParsed'
        } as BEConfig;
    }

    async onCamelized(self: this): ProPAP {
        const {of, Of} = self;
        let exportingRules: Array<ExportingRule> = [];
        if((of || Of) !== undefined){
            const {prsOf} = await import('./prsOf.js');
            exportingRules = prsOf(self);
        }
        return {
            exportingRules
        };
    }

    async hydrate(self: this){
        return {
            resolved: true
        }
    }
}

export interface BeExporting extends AllProps {}

const tagName = 'be-exporting';
const ifWantsToBe = 'exporting';
const upgrade = '*';

const xe = new XE<AP, Actions>({
    config:{
        tagName,
        isEnh: true,
        propDefaults:{
            ...propDefaults,
        },
        propInfo: {
            ...propInfo
        },
        actions:{
            onCamelized: {
                ifAllOf: ['isParsed'],
                ifAtLeastOneOf: ['of', 'Of']
            },
            hydrate: 'exportingRules'
        }
    },
    superclass: BeExporting
});

register(ifWantsToBe, upgrade, tagName);