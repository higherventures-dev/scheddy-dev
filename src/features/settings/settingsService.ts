import { createClient } from "@/utils/supabase/client"; // or your API client

export async function updateBookingSetting(settingName: string, value: boolean) {
    const supabase = await createClient();
    
    // You can adjust this based on your schema. Example: 'settings' table with 'name' and 'value' columns
    const { data, error } = await supabase
        .from('settings')
        .upsert([
            {
                name: settingName,
                value: value,
            },
        ])
        .select();

    if (error) {
        console.error('Error updating setting:', error);
        throw error;
    }

    return data;
}
