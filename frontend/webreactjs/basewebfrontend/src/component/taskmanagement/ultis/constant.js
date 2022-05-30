import { Typography } from "@material-ui/core";

export const boxComponentStyle = {
    backgroundColor: "#fff",
    // <!-- boxShadow: "0 4px 8px rgba(0,0,0,0.07)", -->
    // boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
    boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
    p: 2,
    mb: 3,
    borderRadius: '5px'
};

export const boxChildComponent = {
    boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
    px: 2,
    py: 1,
    mb: 3,
    borderRadius: '5px'
}

export const centerBox = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}


export const Header = ({children}) => {
    return (
        <Typography variant="h4" mb={4} component={'h4'}>
            {children}
        </Typography>
    );
}


