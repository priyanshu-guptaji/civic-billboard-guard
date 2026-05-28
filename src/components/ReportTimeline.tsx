import React from 'react';
import { CheckCircle2, Clock, Bot, Eye, Truck, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ReportStage = 'Submitted' | 'AI Processed' | 'Under Review' | 'Field Agent Dispatched' | 'Resolved';

export interface TimelineEvent {
  stage: ReportStage;
  timestamp?: string;
  description?: string;
}

interface ReportTimelineProps {
  currentStage: ReportStage;
  events?: TimelineEvent[];
}

const STAGES: { stage: ReportStage; icon: React.ElementType; label: string }[] = [
  { stage: 'Submitted', icon: Clock, label: 'Report Submitted' },
  { stage: 'AI Processed', icon: Bot, label: 'AI Verification' },
  { stage: 'Under Review', icon: Eye, label: 'Authority Review' },
  { stage: 'Field Agent Dispatched', icon: Truck, label: 'Agent Dispatched' },
  { stage: 'Resolved', icon: CheckCircle, label: 'Resolved' },
];

const ReportTimeline = ({ currentStage, events = [] }: ReportTimelineProps) => {
  const currentIndex = STAGES.findIndex(s => s.stage === currentStage);

  const getEventForStage = (stage: ReportStage) => {
    return events.find(e => e.stage === stage);
  };

  return (
    <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
      {STAGES.map((stageObj, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const Icon = stageObj.icon;
        const event = getEventForStage(stageObj.stage);

        return (
          <div key={stageObj.stage} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            {/* Icon */}
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-4 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 transition-colors duration-300",
                isCompleted ? "bg-primary border-primary-foreground text-primary-foreground" : "bg-muted border-background text-muted-foreground",
                isCurrent && "ring-2 ring-primary ring-offset-2 ring-offset-background"
              )}
            >
              {isCompleted && !isCurrent ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
            </div>
            
            {/* Card Content */}
            <div className={cn(
              "w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border shadow-sm transition-all duration-300",
              isCurrent ? "border-primary bg-primary/5 shadow-md scale-[1.02]" : "border-border bg-card",
              !isCompleted && "opacity-60"
            )}>
              <div className="flex items-center justify-between mb-1">
                <h4 className={cn("font-semibold text-sm", isCompleted ? "text-foreground" : "text-muted-foreground")}>
                  {stageObj.label}
                </h4>
                {event?.timestamp && (
                  <span className="text-xs text-muted-foreground font-medium">{event.timestamp}</span>
                )}
              </div>
              
              {event?.description ? (
                <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">
                  {isCompleted ? "Step completed successfully." : "Pending completion."}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportTimeline;
