"use client";


import {
Dialog,
DialogTitle,
DialogContent,
DialogActions,
Button,
Divider,
} from "@mui/material";


import { IndentRequest } from "@/features/inventory/types/indent";


interface Props{

open:boolean;

indent:IndentRequest|null;

onClose:()=>void;

}



export default function IndentViewDialog({
open,
indent,
onClose
}:Props){


if(!indent) return null;


return (

<Dialog
open={open}
onClose={onClose}
maxWidth="sm"
fullWidth
>


<DialogTitle>
Indent Details
</DialogTitle>


<DialogContent>


<div className="space-y-4 mt-3">


<div>
<p className="text-sm text-muted-foreground">
Request Number
</p>

<p className="font-semibold">
{indent.requestNumber}
</p>
</div>



<Divider/>



<div>
<p className="text-sm text-muted-foreground">
Department
</p>

<p>
{indent.departmentName}
</p>
</div>



<div>
<p className="text-sm text-muted-foreground">
Requested By
</p>

<p>
{indent.requestedBy}
</p>
</div>



<div>
<p className="text-sm text-muted-foreground">
Items Required
</p>

<p>
{indent.items} items ({indent.totalQuantity} qty)
</p>
</div>



<div>
<p className="text-sm text-muted-foreground">
Status
</p>

<p>
{indent.status}
</p>
</div>


</div>


</DialogContent>


<DialogActions>

<Button onClick={onClose}>
Close
</Button>

</DialogActions>


</Dialog>

)

}