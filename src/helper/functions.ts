import _ from 'lodash';

export class FunctionsHelper {

    public static groupListBy(list: any[], keyToGroupBy: any){
        return _.groupBy(list, keyToGroupBy);
    }
}