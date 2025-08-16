import Button from "react-bootstrap/Button"; 
import Alert from "react-bootstrap/Alert";
const CustomAlert = ({message,type,show,handleAlertClick}) => {
    return (
       
    
                     <Alert show={show} variant={type}>
                       <Alert.Heading>Hurray!</Alert.Heading>
                       <p>{message}</p>
                       <hr />
                       <div className="d-flex justify-content-end">
                         <Button onClick={handleAlertClick} variant="outline-success">
                           Ok
                         </Button>
                       </div>
                     </Alert>
           
        
    );
}

export default CustomAlert;
