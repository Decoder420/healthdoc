"use client";


import { Eye } from "lucide-react";

import { IndentRequest } from "@/features/inventory/types/indent";


interface Props {

  indents:IndentRequest[];

  onView:(indent:IndentRequest)=>void;

}



export default function IndentTable({
  indents,
  onView,
}:Props){


return (

<div>

<h3 className="mb-5 text-lg font-semibold">
  Indent Requests
</h3>


<div className="overflow-x-auto">

<table className="w-full">


<thead className="border-b">

<tr className="text-left">

<th className="pb-3">
Request No
</th>


<th className="pb-3">
Department
</th>


<th className="pb-3 text-center">
Items
</th>


<th className="pb-3 text-center">
Priority
</th>


<th className="pb-3 text-center">
Status
</th>


<th className="pb-3 text-center">
Action
</th>


</tr>

</thead>



<tbody>


{
indents.map((indent)=>(


<tr
key={indent.id}
className="border-b"
>


<td className="py-4">

<p className="font-medium">
{indent.requestNumber}
</p>

<p className="text-xs text-muted-foreground">
{indent.createdAt}
</p>

</td>



<td className="py-4">

{indent.departmentName}

</td>



<td className="py-4 text-center">

{indent.items}

</td>



<td className="py-4 text-center">

<span className="rounded-full bg-muted px-3 py-1 text-xs">

{indent.priority}

</span>

</td>



<td className="py-4 text-center">

<span className="rounded-full bg-muted px-3 py-1 text-xs">

{indent.status}

</span>

</td>



<td className="py-4 text-center">

<button
className="btn btn-ghost btn-icon"
onClick={()=>onView(indent)}
>

<Eye size={16}/>

</button>


</td>



</tr>


))

}


</tbody>


</table>


</div>


</div>


)

}