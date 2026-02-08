import Box from "../Box";
import CopyButton from "../CopyButton";

export default function UrlBox({ value }) {
    return (
        <Box $type="url">
            <a href={value} target="_blank" rel="noreferrer">
                {value}
            </a>
            <CopyButton value={value} />
        </Box>
    );
}
