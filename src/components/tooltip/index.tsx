import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui";

interface CustomTooltipProps {
    children: React.ReactNode
    tooltipText: string
}

const CustomTooltip = ({ children, tooltipText }: CustomTooltipProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default CustomTooltip;