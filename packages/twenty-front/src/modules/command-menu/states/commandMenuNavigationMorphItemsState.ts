import { MorphItem } from '@/object-record/multiple-objects/types/MorphItem';
import { createState } from '@ui/utilities/state/utils/createState';

export const commandMenuNavigationMorphItemByPageState = createState<
  Map<string, MorphItem>
>({
  key: 'command-menu/commandMenuNavigationMorphItemByPageState',
  defaultValue: new Map(),
});
