import GroupState from './group-state-model';
import GroupType from './group-type-model';

interface Group {
    id: number;
    title: string;
    description?: string;
    state: GroupState;
    type: GroupType;
}

export default Group;