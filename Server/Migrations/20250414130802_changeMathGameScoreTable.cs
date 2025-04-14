using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SEII.Server.Migrations
{
    /// <inheritdoc />
    public partial class changeMathGameScoreTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "difficulty",
                table: "mathGameScores",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "difficulty",
                table: "mathGameScores");
        }
    }
}
