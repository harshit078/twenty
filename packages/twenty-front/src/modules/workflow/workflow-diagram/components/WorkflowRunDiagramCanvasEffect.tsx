import { useWorkflowCommandMenu } from '@/command-menu/hooks/useWorkflowCommandMenu';
import { activeTabIdComponentState } from '@/ui/layout/tab/states/activeTabIdComponentState';
import { getSnapshotValue } from '@/ui/utilities/state/utils/getSnapshotValue';
import { workflowIdState } from '@/workflow/states/workflowIdState';
import { workflowSelectedNodeState } from '@/workflow/workflow-diagram/states/workflowSelectedNodeState';
import {
  WorkflowDiagramNode,
  WorkflowDiagramStepNodeData,
} from '@/workflow/workflow-diagram/types/WorkflowDiagram';
import { getWorkflowNodeIconKey } from '@/workflow/workflow-diagram/utils/getWorkflowNodeIconKey';
import { WORKFLOW_RUN_STEP_SIDE_PANEL_TAB_LIST_COMPONENT_ID } from '@/workflow/workflow-steps/constants/WorkflowRunStepSidePanelTabListComponentId';
import { WorkflowRunTabId } from '@/workflow/workflow-steps/types/WorkflowRunTabId';
import { TRIGGER_STEP_ID } from '@/workflow/workflow-trigger/constants/TriggerStepId';
import { OnSelectionChangeParams, useOnSelectionChange } from '@xyflow/react';
import { useCallback } from 'react';
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
import { isDefined } from 'twenty-shared';
import { useIcons } from 'twenty-ui';

export const WorkflowRunDiagramCanvasEffect = () => {
  const { getIcon } = useIcons();
  const setWorkflowSelectedNode = useSetRecoilState(workflowSelectedNodeState);
  const { openWorkflowRunViewStepInCommandMenu } = useWorkflowCommandMenu();

  const workflowId = useRecoilValue(workflowIdState);

  const goBackToFirstWorkflowRunRightDrawerTabIfNeeded = useRecoilCallback(
    ({ snapshot, set }) =>
      () => {
        const activeWorkflowRunRightDrawerTab = getSnapshotValue(
          snapshot,
          activeTabIdComponentState.atomFamily({
            instanceId: WORKFLOW_RUN_STEP_SIDE_PANEL_TAB_LIST_COMPONENT_ID,
          }),
        ) as WorkflowRunTabId | null;

        if (
          activeWorkflowRunRightDrawerTab === 'input' ||
          activeWorkflowRunRightDrawerTab === 'output'
        ) {
          set(
            activeTabIdComponentState.atomFamily({
              instanceId: WORKFLOW_RUN_STEP_SIDE_PANEL_TAB_LIST_COMPONENT_ID,
            }),
            'node',
          );
        }
      },
    [],
  );

  const handleSelectionChange = useCallback(
    ({ nodes }: OnSelectionChangeParams) => {
      const selectedNode = nodes[0] as WorkflowDiagramNode | undefined;

      if (!isDefined(selectedNode)) {
        return;
      }

      setWorkflowSelectedNode(selectedNode.id);

      const selectedNodeData = selectedNode.data as WorkflowDiagramStepNodeData;

      if (
        selectedNode.id === TRIGGER_STEP_ID ||
        selectedNodeData.runStatus === 'not-executed' ||
        selectedNodeData.runStatus === 'running'
      ) {
        goBackToFirstWorkflowRunRightDrawerTabIfNeeded();
      }

      if (isDefined(workflowId)) {
        openWorkflowRunViewStepInCommandMenu(
          workflowId,
          selectedNodeData.name,
          getIcon(getWorkflowNodeIconKey(selectedNodeData)),
        );
      }
    },
    [
      setWorkflowSelectedNode,
      workflowId,
      getIcon,
      goBackToFirstWorkflowRunRightDrawerTabIfNeeded,
      openWorkflowRunViewStepInCommandMenu,
    ],
  );

  useOnSelectionChange({
    onChange: handleSelectionChange,
  });

  return null;
};
