import { Test, TestingModule } from '@nestjs/testing';
import { ActiveTokensController } from './active-tokens.controller';
import { ActiveTokensService } from '../services/active-tokens.service';
import { ActiveToken } from '../entities/active-token.entity';
import { User } from '../entities/user.entity';
import { UserDTO } from '../dtos/user.dto';

describe('ActiveTokensController', () => {
  let controller: ActiveTokensController;
  let activeTokensService: ActiveTokensService;

  const mockActiveTokensService = {
    resendToken: jest.fn(),
    activateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActiveTokensController],
      providers: [
        {
          provide: ActiveTokensService,
          useValue: mockActiveTokensService,
        },
      ],
    }).compile();

    controller = module.get<ActiveTokensController>(ActiveTokensController);
    activeTokensService = module.get<ActiveTokensService>(ActiveTokensService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('resend', () => {
    it('should call ActiveTokensService.resendToken and return the token code', async () => {
      // Cria um objeto de ActiveToken simulado.
      const fakeToken: ActiveToken = {
        id: 'fake-id',
        code: 'abc123',
        used: false,
        expires: new Date(),
        userId: 'user-id',
        user: {} as User,
      };

      // Define o comportamento do método resendToken do serviço.
      mockActiveTokensService.resendToken.mockResolvedValue(fakeToken);

      // Chama o método do controller com um corpo de requisição simulado.
      const result = await controller.resend({ userId: 'user-id' });

      // Verifica se o método do serviço foi chamado com o valor correto.
      expect(activeTokensService.resendToken).toHaveBeenCalledWith('user-id');
      // Verifica se o controller retorna o objeto com a mensagem e o token.code.
      expect(result).toEqual({
        message: 'Token resent',
        token: fakeToken.code,
      });
    });
  });

  describe('activate', () => {
    it('should call ActiveTokensService.activateUser and return the user', async () => {
      // Cria um objeto de User simulado.
      const fakeUser: UserDTO = {
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        active: true,
        passwordHash: 'hashed-password',
        companyId: null,
        company: undefined,
        password: '',
      };

      // Define o comportamento do método activateUser do serviço.
      mockActiveTokensService.activateUser.mockResolvedValue(fakeUser);

      // Chama o método do controller com um corpo de requisição simulado.
      const result = await controller.activate({
        code: 'token-code',
        password: 'newpass',
      });

      // Verifica se o método do serviço foi chamado com os valores corretos.
      expect(activeTokensService.activateUser).toHaveBeenCalledWith(
        'token-code',
        'newpass',
      );
      // Verifica se o controller retorna o objeto com a mensagem e o usuário.
      expect(result).toEqual({
        message: 'User activated successfully',
        user: fakeUser,
      });
    });
  });
});
