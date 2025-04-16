
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface ProposalStageProps {
  proposal: string;
  onGenerateProposal: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export const ProposalStage: React.FC<ProposalStageProps> = ({
  proposal,
  onGenerateProposal,
  onApprove,
  onReject
}) => {
  return (
    <div className="mt-6">
      <h4 className="text-md font-medium text-puzzle-white mb-2">Proposal</h4>
      {proposal ? (
        <div className="bg-puzzle-black/30 border border-puzzle-aqua/20 rounded-md p-4 text-puzzle-white whitespace-pre-line">
          {proposal}
        </div>
      ) : (
        <div className="flex justify-center p-4">
          <Button onClick={onGenerateProposal}>
            Generate Proposal
          </Button>
        </div>
      )}
      
      {proposal && (
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="outline" onClick={onReject}>
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
          <Button onClick={onApprove}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </Button>
        </div>
      )}
    </div>
  );
};
