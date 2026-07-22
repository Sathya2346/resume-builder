import React from 'react';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import { useResumeWorkspace } from '../../hooks/useResumeWorkspace';
import { Bot } from 'lucide-react';

const Workspace = () => {
  const workspaceState = useResumeWorkspace();

  return (
    <div className="workspace-container">
      <LeftPanel {...workspaceState} />
      <RightPanel {...workspaceState} />
    </div>
  );
};

export default Workspace;
