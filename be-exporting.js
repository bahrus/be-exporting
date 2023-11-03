import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
const scriptLookup = new Map();
export class BeExporting extends BE {
    static get beConfig() {
        return {
            parse: true,
            parseAndCamelize: true,
            isParsedProp: 'isParsed'
        };
    }
    async onCamelized(self) {
        const { of, Of } = self;
        let exportingRules = [];
        if ((of || Of) !== undefined) {
            const { prsOf } = await import('./prsOf.js');
            exportingRules = prsOf(self);
        }
        return {
            exportingRules
        };
    }
    async hydrate(self) {
        const { exportingRules, enhancedElement } = self;
        //const {attributes} = enhancedElement;
        for (const exportingRule of exportingRules) {
            const { eventName } = exportingRule;
            const attr = enhancedElement.getAttribute(eventName);
            if (attr === null)
                throw 404;
            let scriptEl;
            if (!scriptLookup.has(attr)) {
                scriptEl = document.createElement('script');
                scriptEl.type = 'module';
                scriptEl._exports = {};
                scriptLookup.set(attr, scriptEl);
                const key = crypto.randomUUID();
                window[key] = scriptEl;
                const splitText = attr.split('export const ');
                const winKey = `window['${key}']`;
                for (let i = 1, ii = splitText.length; i < ii; i++) {
                    const token = splitText[i];
                    const iPosOfEq = token.indexOf('=');
                    const lhs = token.substr(0, iPosOfEq).trim();
                    splitText[i] = `const ${lhs}  = ${winKey}._exports.${lhs} = ${token.substr(iPosOfEq + 1)};`;
                }
                let modifiedText = splitText.join('');
                modifiedText = /* js */ `
                ${modifiedText}
                window['${key}'].dispatchEvent(new Event('load'));
                window['${key}'].dataset.loaded = 'true';
                `;
                scriptEl.innerHTML = modifiedText;
                document.head.appendChild(scriptEl);
            }
            else {
                scriptEl = scriptLookup.get(attr);
            }
            await waitForScriptToLoad(scriptEl);
            self[eventName] = { ...scriptEl._exports };
            console.log({ attr });
        }
        return {
            resolved: true
        };
    }
}
export function waitForScriptToLoad(scriptEl) {
    return new Promise((resolve) => {
        if (scriptEl.dataset.loaded) {
            resolve();
            return;
        }
        scriptEl.addEventListener('load', e => {
            resolve();
        }, { once: true });
    });
}
const tagName = 'be-exporting';
const ifWantsToBe = 'exporting';
const upgrade = '*';
const xe = new XE({
    config: {
        tagName,
        isEnh: true,
        propDefaults: {
            ...propDefaults,
        },
        propInfo: {
            ...propInfo
        },
        actions: {
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
