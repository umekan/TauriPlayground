import { ReactFlow, Background, Controls, useNodesState, useEdgesState } from "reactflow";
import "../App.css";
import 'reactflow/dist/style.css';
import { useMemo } from "react";
import { Node } from "./FlowComponents/Node";

// このcssのimportがないと、reactflowの描画が崩れるので必要
import 'reactflow/dist/style.css';
import { Box } from "@mui/material";

export default function NodeTest() {
    const nodeTypes = useMemo(() => ({ CustomNode: Node }), []);

    const initialNodes = [
        { id: '1', position: { x: 0, y: 0 }, data: { label: '1' }, type: 'CustomNode' },
        { id: '2', position: { x: 0, y: 100 }, data: { label: '3' }, type: 'CustomNode' },
    ];
    const initialEdges = [{ id: '1-2', source: '1', target: '2' }];

    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);

    return (
        <div>
            <Box sx={nodeArea}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}>
                    <Background color="#aaa" gap={16} />
                    <Controls />
                </ReactFlow>
            </Box>
        </div>
    );
}

const nodeArea = {
    alignProperty: 'center',
    margin: 'auto 100px',
    height: 600,
    bgcolor: '#cccccc',
    maxHeight: 800,
    overflow: 'auto',
    '& ul': { padding: 0 },
};
