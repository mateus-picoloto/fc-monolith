import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDTO, FindInvoiceFacadeOutputDTO, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";

export interface UseCasesProps {
    findUseCase: UseCaseInterface;
    generateUseCase: UseCaseInterface;
}


export default class InvoiceFacade implements InvoiceFacadeInterface {
    private _findUseCase: UseCaseInterface;
    private _generateUseCase: UseCaseInterface;

    constructor(props: UseCasesProps) {
        this._findUseCase = props.findUseCase;
        this._generateUseCase = props.generateUseCase;
    }

    public async find(input: FindInvoiceFacadeInputDTO): Promise<FindInvoiceFacadeOutputDTO> {
        return await this._findUseCase.execute(input);
    }

    public async generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
        return await this._generateUseCase.execute(input);
    }

}