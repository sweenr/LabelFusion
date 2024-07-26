import * as RadixTooltip from '@radix-ui/react-tooltip'
import './styles.css'

type TooltipProps = {
    tooltipText: string
    children: React.ReactNode
}

const Tooltip = ({ tooltipText, children }: TooltipProps) => {
    return (
        <RadixTooltip.Provider>
            <RadixTooltip.Root>
                <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
                <RadixTooltip.Portal>
                    <RadixTooltip.Content
                        className="TooltipContent"
                        sideOffset={5}
                    >
                        {tooltipText}
                        <RadixTooltip.Arrow className="TooltipArrow" />
                    </RadixTooltip.Content>
                </RadixTooltip.Portal>
            </RadixTooltip.Root>
        </RadixTooltip.Provider>
    )
}

export default Tooltip
