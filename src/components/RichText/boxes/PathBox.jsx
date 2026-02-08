import Box from "../Box";
import CopyButton from "../CopyButton";

export default function PathBox({ value }) {
    return (
        <Box $type="path">
            <code>{value}</code>
            <CopyButton value={value} />
        </Box>
    );
}
