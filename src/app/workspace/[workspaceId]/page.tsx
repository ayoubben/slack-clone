interface WorkspacePageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspacePage = ({ params }: WorkspacePageProps) => {
  return <div>WorkspacePage : {params.workspaceId}</div>;
};

export default WorkspacePage;
