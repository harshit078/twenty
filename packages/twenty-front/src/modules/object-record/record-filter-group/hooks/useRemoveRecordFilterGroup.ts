import { currentRecordFilterGroupsComponentState } from '@/object-record/record-filter-group/states/currentRecordFilterGroupsComponentState';
import { useRecoilComponentCallbackStateV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentCallbackStateV2';
import { getSnapshotValue } from '@/ui/utilities/state/utils/getSnapshotValue';
import { useRecoilCallback } from 'recoil';

export const useRemoveRecordFilterGroup = () => {
  const currentRecordFilterGroupsCallbackState =
    useRecoilComponentCallbackStateV2(currentRecordFilterGroupsComponentState);

  const removeRecordFilterGroup = useRecoilCallback(
    ({ set, snapshot }) =>
      (recordFilterGroupIdToRemove: string) => {
        const currentRecordFilterGroups = getSnapshotValue(
          snapshot,
          currentRecordFilterGroupsCallbackState,
        );

        const hasFoundRecordFilterGroupInCurrentRecordFilterGroups =
          currentRecordFilterGroups.some(
            (existingRecordFilterGroup) =>
              existingRecordFilterGroup.id === recordFilterGroupIdToRemove,
          );

        if (hasFoundRecordFilterGroupInCurrentRecordFilterGroups) {
          set(
            currentRecordFilterGroupsCallbackState,
            (currentRecordFilterGroups) => {
              const newCurrentRecordFilterGroups = [
                ...currentRecordFilterGroups,
              ];

              const indexOfRecordFilterGroupToRemove =
                newCurrentRecordFilterGroups.findIndex(
                  (existingRecordFilterGroup) =>
                    existingRecordFilterGroup.id ===
                    recordFilterGroupIdToRemove,
                );

              if (indexOfRecordFilterGroupToRemove === -1) {
                return newCurrentRecordFilterGroups;
              }

              newCurrentRecordFilterGroups.splice(
                indexOfRecordFilterGroupToRemove,
                1,
              );

              return newCurrentRecordFilterGroups;
            },
          );
        }
      },
    [currentRecordFilterGroupsCallbackState],
  );

  return {
    removeRecordFilterGroup,
  };
};
