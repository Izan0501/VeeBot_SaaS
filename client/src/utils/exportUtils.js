import toast from 'react-hot-toast';

export const downloadFile = (candidates, format) => {
    try {
        let content, type, extension;

        if (format === 'json') {
            content = JSON.stringify(candidates, null, 2);
            type = "application/json";
            extension = "json";
        } else {
            // CSV Logic
            const separator = ";";
            const headers = ["ID", "Nombre", "Rol Detectado", "Score", "Estado", "Fecha", "Skills", "Email"];

            // BOM para que Excel abra bien los caracteres latinos
            const csvHeader = headers.join(separator) + "\n";

            const csvRows = candidates.map(c => {
                const cleanName = c.name ? c.name.replace(/;/g, ",") : "";
                const cleanRole = c.role ? c.role.replace(/;/g, ",") : "";
                const cleanSkills = c.skills ? c.skills.join(" | ") : "";
                const cleanEmail = c.email || "";
                return [c.id, cleanName, cleanRole, c.score, c.status, c.date, cleanSkills, cleanEmail].join(separator);
            });

            content = "\uFEFF" + csvHeader + csvRows.join("\n");
            type = "text/csv;charset=utf-8;";
            extension = "csv";
        }

        const blob = new Blob([content], { type });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `veebot_export_${new Date().toISOString().slice(0, 10)}.${extension}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Base de datos exportada en ${extension.toUpperCase()}`);
        return true;
    } catch (e) {
        console.error(e);
        toast.error("Error al generar el archivo");
        return false;
    }
};