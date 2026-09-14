import { TableBase, TableBody, TableHead, TableRoot } from "@/ui";

const rows = [
  { name: "Ada", role: "admin" },
  { name: "Linus", role: "dev" },
  { name: "Grace", role: "dev" },
];

export default function Demo() {
  return (
    <TableRoot className="max-w-sm">
      <TableHead>
        <TableBase>
          <colgroup>
            <col className="w-1/3" />
            <col />
          </colgroup>
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-10 px-3 text-left font-medium text-muted-foreground">Name</th>
              <th className="h-10 px-3 text-left font-medium text-muted-foreground">Role</th>
            </tr>
          </thead>
        </TableBase>
      </TableHead>
      <TableBody className="max-h-24">
        <TableBase>
          <colgroup>
            <col className="w-1/3" />
            <col />
          </colgroup>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-b last:border-0">
                <td className="px-3 py-2.5">{row.name}</td>
                <td className="px-3 py-2.5">{row.role}</td>
              </tr>
            ))}
          </tbody>
        </TableBase>
      </TableBody>
    </TableRoot>
  );
}
