using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SEII.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddedScoreTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "role",
                table: "accounts",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "aimTrainerScores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AccountId = table.Column<int>(type: "INTEGER", nullable: false),
                    score = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_aimTrainerScores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_aimTrainerScores_accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "mathGameScores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AccountId = table.Column<int>(type: "INTEGER", nullable: false),
                    score = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mathGameScores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_mathGameScores_accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "seekerScores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AccountId = table.Column<int>(type: "INTEGER", nullable: false),
                    score = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_seekerScores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_seekerScores_accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "sequenceScores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AccountId = table.Column<int>(type: "INTEGER", nullable: false),
                    score = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sequenceScores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_sequenceScores_accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "typingScores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AccountId = table.Column<int>(type: "INTEGER", nullable: false),
                    score = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_typingScores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_typingScores_accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_aimTrainerScores_AccountId",
                table: "aimTrainerScores",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_mathGameScores_AccountId",
                table: "mathGameScores",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_seekerScores_AccountId",
                table: "seekerScores",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_sequenceScores_AccountId",
                table: "sequenceScores",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_typingScores_AccountId",
                table: "typingScores",
                column: "AccountId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "aimTrainerScores");

            migrationBuilder.DropTable(
                name: "mathGameScores");

            migrationBuilder.DropTable(
                name: "seekerScores");

            migrationBuilder.DropTable(
                name: "sequenceScores");

            migrationBuilder.DropTable(
                name: "typingScores");

            migrationBuilder.DropColumn(
                name: "role",
                table: "accounts");
        }
    }
}
