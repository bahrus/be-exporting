import {register} from 'be-hive/register.js';
import {tagName } from './be-exporting.js';
import './be-exporting.js';

const ifWantsToBe = 'exporting';
const upgrade = '*';

register(ifWantsToBe, upgrade, tagName);