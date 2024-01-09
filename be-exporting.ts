import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA, ExportingRule} from './types';
import {register} from 'be-hive/register.js';

const scriptLookup: Map<string, HTMLScriptElement> = new Map();

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
        const {exportingRules, enhancedElement} = self;
        //const {attributes} = enhancedElement;
        for(const exportingRule of exportingRules!){
            const {eventName} = exportingRule;
            const attr = enhancedElement.getAttribute(eventName);
            if(attr === null) throw 404;
            const exports = await parse(attr);
            (<any>self)[eventName] = {...exports};
            //console.log({attr});
        }
        return {
            resolved: true
        }
    }
}

export async function parse(attr: string){
    let scriptEl: HTMLScriptElement | undefined;
    if(!scriptLookup.has(attr)){
        scriptEl = document.createElement('script');
        scriptEl.type = 'module';
        (<any>scriptEl)._exports = {};
        scriptLookup.set(attr, scriptEl);
        const key = crypto.randomUUID(); 
        (<any>window)[key] = scriptEl;
        const splitText = attr.split('export const ');
        const winKey = `window['${key}']`;
        for(let i = 1, ii = splitText.length; i < ii; i++){
            const token = splitText[i];
            const iPosOfEq = token.indexOf('=');
            const lhs = token.substr(0, iPosOfEq).trim();
            splitText[i] = `const ${lhs}  = ${winKey}._exports.${lhs} = ${token.substr(iPosOfEq + 1)};`
        }
        let modifiedText = splitText.join('');
        modifiedText = /* js */`
        ${modifiedText}
        window['${key}'].dispatchEvent(new Event('load'));
        window['${key}'].dataset.loaded = 'true';
        `;
        scriptEl.innerHTML = modifiedText;
        document.head.appendChild(scriptEl);
    }else{
        scriptEl = scriptLookup.get(attr);
    }
    await waitForScriptToLoad(scriptEl!);
    return (<any>scriptEl)._exports;
}

export function waitForScriptToLoad(scriptEl: HTMLScriptElement): Promise<void>{
    return new Promise((resolve) => {
        if(scriptEl.dataset.loaded){
            resolve();
            return;
        }
        scriptEl.addEventListener('load', e => {
            resolve();
        }, {once: true})
    });
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