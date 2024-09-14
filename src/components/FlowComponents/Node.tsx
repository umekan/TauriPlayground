import { Handle, NodeProps, Position } from 'reactflow';

export type NodeData = {
  label: string;
}

export function Node({ id, data }: NodeProps<NodeData>) {
  return (
    <>
      <div
        style={{
          background: 'blue',
          padding: 10,
          borderRadius: 10,
          width: 100,
          height: 20,
        }}>
        <strong>{data.label}</strong>
      </div>
      <Handle
        id={`${id}-target`}
        type="target"
        position={Position.Top}
      />
      <Handle
        id={`${id}-source`}
        type="source"
        position={Position.Bottom}
      />
    </>
  );
}
