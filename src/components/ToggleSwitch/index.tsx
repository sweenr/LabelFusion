import * as Switch from '@radix-ui/react-switch'
import './styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'

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
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: '1rem auto',
                }}
            >
                <Switch.Root
                    className="SwitchRoot"
                    id={id}
                    checked={checked}
                    onCheckedChange={onCheckedChange}
                >
                    <Switch.Thumb className="SwitchThumb">
                        {checked ? (
                            <FontAwesomeIcon icon={faCircleCheck} size="lg" />
                        ) : null}
                    </Switch.Thumb>
                </Switch.Root>
                <label
                    className="Label"
                    htmlFor={id}
                    style={{ paddingRight: 15 }}
                >
                    {labelText}
                </label>
            </div>
        </form>
    )
}

export default ToggleSwitch
