import "./LabelAndInput.css";

const LabelAndInput = (props) => {
    const {
        label,
        input,
        validate
    } = props;
    return (
        <div className="LabelAndInputWrapper">
            <div className="LabelAndInputLabel">
                {label}
            </div>
            <div className="LabelAndInputInput">
                {input}
                {validate && <div className="LabelAndInputError">
                    {validate}
                </div>}
            </div>
        </div>
    )
}

export default LabelAndInput;
