import { type UpdatePersonInput, type Person } from '../schema';

export const updatePerson = async (input: UpdatePersonInput): Promise<Person> => {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is updating person information including duty status,
    // device assignments, and contact information in the database.
    return Promise.resolve({
        id: input.id,
        user_id: 0,
        employee_id: '',
        phone: input.phone ?? null,
        emergency_contact: input.emergency_contact ?? null,
        assigned_device_id: input.assigned_device_id ?? null,
        is_on_duty: input.is_on_duty ?? false,
        created_at: new Date(),
        updated_at: new Date()
    } as Person);
};