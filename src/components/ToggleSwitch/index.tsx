import * as Switch from '@radix-ui/react-switch'
import './styles.css'

type ToggleSwitchProps = {
    id: string
    labelText: string
    checked?: boolean
    onCheckedChange: (checked: boolean) => void
}

const ToggleSwitch = ({
    id,
    labelText,
    checked,
    onCheckedChange,
}: ToggleSwitchProps) => {
    return (
        <form>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <label
                    className="Label"
                    htmlFor={id}
                    style={{ paddingRight: 15 }}
                >
                    {labelText}
                </label>
                <Switch.Root
                    className="SwitchRoot"
                    id={id}
                    checked={checked}
                    onCheckedChange={onCheckedChange}
                >
                    <Switch.Thumb className="SwitchThumb" />
                </Switch.Root>
            </div>
        </form>
    )
}

export default ToggleSwitch
