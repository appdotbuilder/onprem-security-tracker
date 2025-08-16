import { type CreatePersonInput, type Person } from '../schema';

export const createPerson = async (input: CreatePersonInput): Promise<Person> => {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is creating a new person (security officer or driver)
    // linked to a user account and persisting it in the database.
    return Promise.resolve({
        id: 0,
        user_id: input.user_id,
        employee_id: input.employee_id,
        phone: input.phone ?? null,
        emergency_contact: input.emergency_contact ?? null,
        assigned_device_id: input.assigned_device_id ?? null,
        is_on_duty: input.is_on_duty ?? false,
        created_at: new Date(),
        updated_at: new Date()
    } as Person);
};