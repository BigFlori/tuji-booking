import GroupState from './group-state-model';
import GroupType from './group-type-model';

interface Group {
    id: string;
    title: string;
    description?: string;
    state: GroupState;
    type: GroupType;
    order: number;
}

export default Group;