"use server";

// In a real application, this would be a database connection
// For now, we'll use an in-memory store to demonstrate functionality
let systemSettings = {
    geminiKey: "",
    openaiKey: "",
    limits: {
        free: 10,
        basic: 100,
        pro: 1000
    }
};

export async function getSettings() {
    // Simulate DB delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return systemSettings;
}

export async function updateSettings(formData: FormData) {
    // Simulate DB delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const geminiKey = formData.get("geminiKey") as string;
    const openaiKey = formData.get("openaiKey") as string;
    const limitFree = parseInt(formData.get("limitFree") as string) || 10;
    const limitBasic = parseInt(formData.get("limitBasic") as string) || 100;
    const limitPro = parseInt(formData.get("limitPro") as string) || 1000;

    // Update settings
    systemSettings = {
        geminiKey,
        openaiKey,
        limits: {
            free: limitFree,
            basic: limitBasic,
            pro: limitPro
        }
    };

    console.log("Settings updated:", {
        ...systemSettings,
        geminiKey: geminiKey ? "********" : "not set",
        openaiKey: openaiKey ? "********" : "not set"
    });

    return { success: true, message: "Configurações salvas com sucesso!" };
}

export async function deleteKey(keyName: 'geminiKey' | 'openaiKey') {
    // Simulate DB delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (keyName === 'geminiKey') systemSettings.geminiKey = "";
    if (keyName === 'openaiKey') systemSettings.openaiKey = "";

    return { success: true, message: "Chave removida com sucesso!" };
}
