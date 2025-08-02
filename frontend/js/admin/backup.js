  function downloadBackup() {
    fetch("/api/backup/download", {
      method: "GET",
      credentials: "include"
    })
      .then(response => {
        if (!response.ok) throw new Error("שגיאה בגיבוי");
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "backup.json";
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(err => {
        alert("שגיאה בהורדת הגיבוי");
        console.error(err);
      });
  }