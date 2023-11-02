import {IBE} from 'be-enhanced/types.js';

export interface EndUserProps extends IBE{
    of?: Array<OfStatement>;
    Of?: Array<OfStatement>;
}

export interface AllProps extends EndUserProps{

}

export interface Actions{
    
}

export type OfStatement = string;