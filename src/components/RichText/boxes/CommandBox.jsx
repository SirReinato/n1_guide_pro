import Box from "../Box";
import CopyButton from "../CopyButton";

export default function CommandBox({ value }) {
    return (
        <Box $type="command">
            <code>{value}</code>
            <CopyButton value={value} />
        </Box>
    );
}
