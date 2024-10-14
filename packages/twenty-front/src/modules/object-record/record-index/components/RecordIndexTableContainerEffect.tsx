import { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { contextStoreCurrentObjectMetadataIdState } from '@/context-store/states/contextStoreCurrentObjectMetadataIdState';
import { contextStoreTargetedRecordIdsState } from '@/context-store/states/contextStoreTargetedRecordIdsState';
import { useColumnDefinitionsFromFieldMetadata } from '@/object-metadata/hooks/useColumnDefinitionsFromFieldMetadata';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useRecordActionBar } from '@/object-record/record-action-bar/hooks/useRecordActionBar';
import { useHandleToggleColumnFilter } from '@/object-record/record-index/hooks/useHandleToggleColumnFilter';
import { useHandleToggleColumnSort } from '@/object-record/record-index/hooks/useHandleToggleColumnSort';
import { useRecordTableStates } from '@/object-record/record-table/hooks/internal/useRecordTableStates';
import { useRecordTable } from '@/object-record/record-table/hooks/useRecordTable';
import { useRecoilComponentValueV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValueV2';
import { useSetRecordCountInCurrentView } from '@/views/hooks/useSetRecordCountInCurrentView';
import { entityCountInCurrentViewComponentState } from '@/views/states/entityCountInCurrentViewComponentState';

type RecordIndexTableContainerEffectProps = {
  objectNameSingular: string;
  recordTableId: string;
  viewBarId: string;
};

export const RecordIndexTableContainerEffect = ({
  objectNameSingular,
  recordTableId,
  viewBarId,
}: RecordIndexTableContainerEffectProps) => {
  const {
    setAvailableTableColumns,
    setOnEntityCountChange,
    resetTableRowSelection,
    selectedRowIdsSelector,
    setOnToggleColumnFilter,
    setOnToggleColumnSort,
  } = useRecordTable({
    recordTableId,
  });

  const setContextStoreTargetedRecordIds = useSetRecoilState(
    contextStoreTargetedRecordIdsState,
  );

  const setContextStoreCurrentObjectMetadataItem = useSetRecoilState(
    contextStoreCurrentObjectMetadataIdState,
  );

  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const { columnDefinitions } =
    useColumnDefinitionsFromFieldMetadata(objectMetadataItem);

  const { setRecordCountInCurrentView } =
    useSetRecordCountInCurrentView(viewBarId);

  useEffect(() => {
    setAvailableTableColumns(columnDefinitions);
  }, [columnDefinitions, setAvailableTableColumns]);

  const { tableRowIdsState, hasUserSelectedAllRowsState } =
    useRecordTableStates(recordTableId);

  // TODO: verify this instance id works
  const entityCountInCurrentView = useRecoilComponentValueV2(
    entityCountInCurrentViewComponentState,
    recordTableId,
  );
  const hasUserSelectedAllRows = useRecoilValue(hasUserSelectedAllRowsState);
  const tableRowIds = useRecoilValue(tableRowIdsState);

  const selectedRowIds = useRecoilValue(selectedRowIdsSelector());

  const numSelected =
    hasUserSelectedAllRows && entityCountInCurrentView
      ? selectedRowIds.length === tableRowIds.length
        ? entityCountInCurrentView
        : entityCountInCurrentView -
          (tableRowIds.length - selectedRowIds.length) // unselected row Ids
      : selectedRowIds.length;

  const { setActionBarEntries, setContextMenuEntries } = useRecordActionBar({
    objectMetadataItem,
    selectedRecordIds: selectedRowIds,
    callback: resetTableRowSelection,
    totalNumberOfRecordsSelected: numSelected,
  });

  const handleToggleColumnFilter = useHandleToggleColumnFilter({
    objectNameSingular,
    viewBarId,
  });

  const handleToggleColumnSort = useHandleToggleColumnSort({
    objectNameSingular,
    viewBarId,
  });

  useEffect(() => {
    setOnToggleColumnFilter(
      () => (fieldMetadataId: string) =>
        handleToggleColumnFilter(fieldMetadataId),
    );
  }, [setOnToggleColumnFilter, handleToggleColumnFilter]);

  useEffect(() => {
    setOnToggleColumnSort(
      () => (fieldMetadataId: string) =>
        handleToggleColumnSort(fieldMetadataId),
    );
  }, [setOnToggleColumnSort, handleToggleColumnSort]);

  useEffect(() => {
    setActionBarEntries?.();
    setContextMenuEntries?.();
  }, [setActionBarEntries, setContextMenuEntries]);

  useEffect(() => {
    setOnEntityCountChange(
      () => (entityCount: number) => setRecordCountInCurrentView(entityCount),
    );
  }, [setRecordCountInCurrentView, setOnEntityCountChange]);

  useEffect(() => {
    setContextStoreTargetedRecordIds(selectedRowIds);
    setContextStoreCurrentObjectMetadataItem(objectMetadataItem?.id);

    return () => {
      setContextStoreTargetedRecordIds([]);
      setContextStoreCurrentObjectMetadataItem(null);
    };
  }, [
    objectMetadataItem?.id,
    selectedRowIds,
    setContextStoreCurrentObjectMetadataItem,
    setContextStoreTargetedRecordIds,
  ]);

  return <></>;
};
