using Microsoft.AspNetCore.Identity;
using Taxi.Data;

namespace Taxi.Services;

public class RoleSeeder
{
    public static async Task SeedAsync(
        UserManager<ApplicationUser> userManager, 
        RoleManager<IdentityRole> roleManager)
    {
        // Создаем роли, если их нет
        var roles = new[] { "Admin", "Driver", "Passenger" };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // Создаем администратора, если его нет
        var adminEmail = "admin@example.com";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail
            };

            var result = await userManager.CreateAsync(adminUser, "AdminPassword123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }

        // Пример добавления тестового водителя
        var driverEmail = "driver@example.com";
        var driverUser = await userManager.FindByEmailAsync(driverEmail);
        if (driverUser == null)
        {
            driverUser = new ApplicationUser
            {
                UserName = driverEmail,
                Email = driverEmail
            };

            var result = await userManager.CreateAsync(driverUser, "DriverPassword123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(driverUser, "Driver");
            }
        }

        // Пример добавления тестового пассажира
        var passengerEmail = "passenger@example.com";
        var passengerUser = await userManager.FindByEmailAsync(passengerEmail);
        if (passengerUser == null)
        {
            passengerUser = new ApplicationUser
            {
                UserName = passengerEmail,
                Email = passengerEmail
            };

            var result = await userManager.CreateAsync(passengerUser, "PassengerPassword123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(passengerUser, "Passenger");
            }
        }
    }
}