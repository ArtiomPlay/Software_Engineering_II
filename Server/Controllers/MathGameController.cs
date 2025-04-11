using Microsoft.AspNetCore.Mvc;

namespace SE_II.Server.Controllers{
    [ApiController]
    [Route("api/[controller]")]
    public class MathGameController : ControllerBase{
        private readonly Random _random=new Random();

        [HttpGet("get_formula")]
        public IActionResult GetFormula([FromQuery] string difficulty="easy"){
            string formula;
            int solution;

            switch(difficulty.ToLower()){
                case "easy":
                    formula=GenerateSingleOperation(1,10,out solution);
                    break;
                case "medium":
                    formula=GenerateSingleOperation(1,50,out solution);
                    break;
                case "hard":
                    formula=GenerateMultiStepFormula(3,20,out solution);
                    break;
                default:
                    return BadRequest("Invalid difficulty. Choose 'easy', 'medium', 'hard'");
            }

            return Ok(new{formula,solution});
        }

        private string GenerateSingleOperation(int min,int max,out int solution){
            int num1=_random.Next(min,max);
            int num2=_random.Next(min,max);
            string[] operators={"+","-","*"};
            string op=operators[_random.Next(operators.Length)];

            solution=op switch{
                "+"=>num1+num2,
                "-"=>num1-num2,
                "*"=>num1*num2,
                _=>0
            };

            return $"{num1} {op} {num2}";
        }

        private string GenerateMultiStepFormula(int stepCount,int maxNumber,out int solution){
            string formula="";
            int currentValue=_random.Next(10,maxNumber);
            for(int i=1;i<stepCount;i++){
                formula+="(";
            }
            formula+=currentValue.ToString();

            for(int i=0;i<stepCount;i++){
                int nextNumber=_random.Next(1,maxNumber);
                string[] operators={"+","-","*"};
                string op=operators[_random.Next(operators.Length)];

                formula+=$"{op} {nextNumber}";
                if(i+1!=stepCount){
                    formula+=")";
                }
                currentValue=CalculateNextValue(currentValue,nextNumber,op);
            }

            solution=currentValue;
            return formula;
        }

        private int CalculateNextValue(int currentValue,int nextValue,string operation){
            return operation switch{
                "+"=>currentValue+nextValue,
                "-"=>currentValue-nextValue,
                "*"=>currentValue*nextValue,
                _=>currentValue
            };
        }
    }
}