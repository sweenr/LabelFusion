import * as Switch from '@radix-ui/react-switch'
import './styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { faFlaskVial } from '@fortawesome/pro-duotone-svg-icons'
import Tooltip from '../Tooltip'

type ToggleSwitchProps = {
    id: string
    labelText: string
    experimental?: boolean
    checked?: boolean
    onCheckedChange: (checked: boolean) => void
}

const ToggleSwitch = ({
    id,
    labelText,
    experimental,
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
                    {labelText}{' '}
                    {experimental ? (
                        <Tooltip tooltipText="Experimental">
                            <FontAwesomeIcon
                                icon={faFlaskVial}
                                size="lg"
                                style={{ marginLeft: '0.25rem' }}
                            />
                        </Tooltip>
                    ) : (
                        ''
                    )}
                </label>
            </div>
        </form>
    )
}

export default ToggleSwitch
