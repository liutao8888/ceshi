/**********************************************************************************************************************
Copyright (C) 2009-2010, ɽ���±�����Ϣ�����ɷ����޹�˾ 
�ļ���: TKIOSKDLL.h
�汾 : V1.14
����: 2010-12-15
����:  TKIOSK��̬��ӿڼ��궨��
�����б�:	1.	TKIOSK_OpenCom()
			2.	TKIOSK_CloseCom()
			3.	TKIOSK_OpenLptByDrv()
			4.	TKIOSK_CloseDrvLPT()
			5.	TKIOSK_OpenUsb()
			6.	TKIOSK_OpenUsbByID()
			7.	TKIOSK_CloseUsb()
			8.	TKIOSK_OpenDrv()
			9.	TKIOSK_CloseDrv()
			10.	TKIOSK_OpenNibblePar()
			11.	TKIOSK_CloseNibblePar()
			12.	TKIOSK_OpenNet()
			13.	TKIOSK_CloseNet()
			14.	TKIOSK_StartDoc()
			15.	TKIOSK_EndDoc()
			16.	TKIOSK_SetComTimeOuts()
			17.	TKIOSK_SetUsbTimeOuts()
			18.	TKIOSK_SetNibbleParTimeOuts()
			19.	TKIOSK_NibbleParPrintToMemory()
			20.	TKIOSK_NibbleParFlushMemory()
			21.	TKIOSK_WriteData()
			22.	TKIOSK_ReadData()
			23.	TKIOSK_SendFile()
			24.	TKIOSK_BeginSaveToFile()
			25.	TKIOSK_EndSaveToFile()
			26.	TKIOSK_QueryStatus()
			27.	TKIOSK_RTQueryStatus()
			28.	TKIOSK_QueryASB()
			29.	TKIOSK_GetVersionInfo()
			30.	TKIOSK_Reset()
			31.	TKIOSK_SetPaperMode()
			32.	TKIOSK_SetMode()
			33.	TKIOSK_SetLineSpacing()
			34.	TKIOSK_SetRightSpacing()
			35.	TKIOSK_SetOppositePosition()
			36.	TKIOSK_SetTabs()
			37.	TKIOSK_ExecuteTabs()
			38.	TKIOSK_PreDownloadBmpToRAM()
			39.	TKIOSK_PreDownloadBmpToFlash()
			40.	TKIOSK_SetCharSetAndCodePage()
			41.	TKIOSK_FeedLine()
			42.	TKIOSK_FeedLines()
			43.	TKIOSK_MarkerFeedPaper()
			44.	TKIOSK_CutPaper()
			45.	TKIOSK_S_SetLeftMarginAndAreaWidth()
			46.	TKIOSK_S_SetAlignMode()
			47.	TKIOSK_S_Textout()
			48.	TKIOSK_S_DownloadPrintBmp()
			49.	TKIOSK_S_PrintBmpInRAM()
			50.	TKIOSK_S_PrintBmpInFlash()
			51.	TKIOSK_S_PrintBarcode()
			52.	TKIOSK_P_SetAreaAndDirection()
			53.	TKIOSK_P_Textout()
			54.	TKIOSK_P_DownloadPrintBmp()
			55. TKIOSK_P_PrintBmpInRAM()
			56.	TKIOSK_P_PrintBmpInFlash()
			57.	TKIOSK_P_PrintBarcode()
			58.	TKIOSK_P_Print()
			59.	TKIOSK_P_Clear()
			60.	TKIOSK_P_Clear()
			61.	TKIOSK_S_TestPrint()
			62.	TKIOSK_SetPrintFromStart()
			63. TKIOSK_SetRaster()
			64.	TKIOSK_SetChineseFont()
			65.	TKIOSK_EnumNetPrinter()
			66.	TKIOSK_EnumDrvPrinter()
**********************************************************************************************************************/
#ifndef __TKIOSKDLL__H__
#define __TKIOSKDLL__H__

/**********************************************************************************************************************
*�˿����Ͷ���
**********************************************************************************************************************/
#define		TKIOSK_COM				0x00					//����
#define		TKIOSK_LPT				(TKIOSK_COM + 0x01)		//����
#define		TKIOSK_USB				(TKIOSK_COM + 0x02)		//USB�ӿ�
#define		TKIOSK_DRV				(TKIOSK_COM + 0x03)		//�����ӿ�
#define		TKIOSK_NIBBLEPAR		(TKIOSK_COM + 0x04)		//�ֽڲ���
#define		TKIOSK_NET				(TKIOSK_COM + 0x05)		//����ӿ�

/**********************************************************************************************************************
*����ֵ�궨��
**********************************************************************************************************************/
#define		TKIOSK_SUCCESS						1001	//�������
#define		TKIOSK_FAIL							1002	//��������
#define		TKIOSK_ERROR_INVALID_HANDLE			1101	//�ڲ������������д�����
#define		TKIOSK_ERROR_INVALID_PARAMETER		1102	//��������
#define		TKIOSK_ERROR_LOADLIBRARY			1103	//���ض�̬��ʧ��
#define		TKIOSK_ERROR_INVALID_PATH			1201	//·������
#define		TKIOSK_ERROR_NOT_BITMAP				1202	//�ļ�����λͼ
#define		TKIOSK_ERROR_NOT_MONO_BITMAP		1203	//λͼ���ǵ�ɫ��
#define		TKIOSK_ERROR_BEYOND_AREA			1204	//λͼ�����ܴ�ӡ

/**********************************************************************************************************************
*���ڣ��ֽڲ��ھ������
**********************************************************************************************************************/
#define		TKIOSK_LPT_HANDLE					-1		//�������
#define		TKIOSK_NIBBLEPAR_HANDLE				-2		//��������

/**********************************************************************************************************************
*����ֹͣλѡ��
**********************************************************************************************************************/
#define		TKIOSK_COM_ONESTOPBIT				0x00							//ֹͣλΪ1
#define		TKIOSK_COM_TWOSTOPBITS				(TKIOSK_COM_ONESTOPBIT + 0x01)	//ֹͣλΪ2

/**********************************************************************************************************************
*����У��λѡ��
**********************************************************************************************************************/
#define		TKIOSK_COM_NOPARITY					0x00							//��У��
#define		TKIOSK_COM_ODDPARITY				(TKIOSK_COM_NOPARITY + 0x01)	//��У��
#define		TKIOSK_COM_EVENPARITY				(TKIOSK_COM_NOPARITY + 0x02)	//żУ��
#define		TKIOSK_COM_MARKPARITY				(TKIOSK_COM_NOPARITY + 0x03)	//MARKУ��
#define		TKIOSK_COM_SPACEPARITY				(TKIOSK_COM_NOPARITY + 0x04)	//SPACEУ��

/**********************************************************************************************************************
*��������������λѡ��
**********************************************************************************************************************/
#define		TKIOSK_COM_DTR_DSR					0x00							//DTR_DSR
#define		TKIOSK_COM_RTS_CTS					(TKIOSK_COM_DTR_DSR + 0x01)		//RTS_CTS	
#define		TKIOSK_COM_XON_XOFF					(TKIOSK_COM_DTR_DSR + 0x02)		//XON_XOFF
#define		TKIOSK_COM_NO_HANDSHAKE				(TKIOSK_COM_DTR_DSR + 0x03)		//������

/**********************************************************************************************************************
*��ӡģʽ
**********************************************************************************************************************/	
#define		TKIOSK_PRINT_MODE_STANDARD			0x00								//��׼ģʽ	
#define		TKIOSK_PRINT_MODE_PAGE				(TKIOSK_PRINT_MODE_STANDARD + 0x01)	//ҳģʽ

/**********************************************************************************************************************
*ֽ������
**********************************************************************************************************************/	
#define		TKIOSK_PAPER_SERIAL					0x00							//����ֽ
#define		TKIOSK_PAPER_SIGN					(TKIOSK_PAPER_SERIAL + 0x01)	//���ֽ

/**********************************************************************************************************************
*�ַ�����
**********************************************************************************************************************/
#define		TKIOSK_FONT_TYPE_STANDARD			0x00								//��׼����
#define		TKIOSK_FONT_TYPE_COMPRESSED			(TKIOSK_FONT_TYPE_STANDARD + 0x01)	//ѹ������
#define		TKIOSK_FONT_TYPE_UDC				(TKIOSK_FONT_TYPE_STANDARD + 0x02)	//�Զ�������
#define		TKIOSK_FONT_TYPE_CHINESE			(TKIOSK_FONT_TYPE_STANDARD + 0x03)	//����

/**********************************************************************************************************************
*�ַ��ķ��
**********************************************************************************************************************/
#define		TKIOSK_FONT_STYLE_NORMAL			0x00	//��������
#define		TKIOSK_FONT_STYLE_BOLD				0x08	//�Ӵ�����	
#define		TKIOSK_FONT_STYLE_THIN_UNDERLINE	0x80	//���»���
#define		TKIOSK_FONT_STYLE_THICK_UNDERLINE	0x100	//˫�»���
#define		TKIOSK_FONT_STYLE_UPSIDEDOWN		0x200	//��������
#define		TKIOSK_FONT_STYLE_REVERSE			0x400	//��������
#define		TKIOSK_FONT_STYLE_CLOCKWISE_90		0x1000	//��ת����

/**********************************************************************************************************************
*λͼ��ӡģʽ
**********************************************************************************************************************/
#define		TKIOSK_BITMAP_MODE_8SINGLE_DENSITY		0x00	//8�㵥�ܶ�
#define		TKIOSK_BITMAP_MODE_8DOUBLE_DENSITY		0x01	//8��˫�ܶ�
#define		TKIOSK_BITMAP_MODE_24SINGLE_DENSITY		0x20	//24�㵥�ܶ�
#define		TKIOSK_BITMAP_MODE_24DOUBLE_DENSITY		0x21	//24��˫�ܶ�

/**********************************************************************************************************************
*λͼ��ӡģʽ
**********************************************************************************************************************/
#define		TKIOSK_BITMAP_PRINT_NORMAL			0x00								//����
#define		TKIOSK_BITMAP_PRINT_DOUBLE_WIDTH	(TKIOSK_BITMAP_PRINT_NORMAL + 0x01)	//����
#define		TKIOSK_BITMAP_PRINT_DOUBLE_HEIGHT	(TKIOSK_BITMAP_PRINT_NORMAL + 0x02)	//����
#define		TKIOSK_BITMAP_PRINT_QUADRUPLE		(TKIOSK_BITMAP_PRINT_NORMAL + 0x03)	//������

/**********************************************************************************************************************
*��������
**********************************************************************************************************************/
#define		TKIOSK_BARCODE_TYPE_UPC_A           0x41								//UPC_A
#define		TKIOSK_BARCODE_TYPE_UPC_E           (TKIOSK_BARCODE_TYPE_UPC_A + 0x01)	//UPC_E
#define		TKIOSK_BARCODE_TYPE_JAN13           (TKIOSK_BARCODE_TYPE_UPC_A + 0x02)	//JAN13
#define		TKIOSK_BARCODE_TYPE_JAN8            (TKIOSK_BARCODE_TYPE_UPC_A + 0x03)	//JAN8 
#define		TKIOSK_BARCODE_TYPE_CODE39          (TKIOSK_BARCODE_TYPE_UPC_A + 0x04)	//CODE39
#define		TKIOSK_BARCODE_TYPE_ITF             (TKIOSK_BARCODE_TYPE_UPC_A + 0x05)	//ITF 
#define		TKIOSK_BARCODE_TYPE_CODEBAR         (TKIOSK_BARCODE_TYPE_UPC_A + 0x06)	//CODEBAR
#define		TKIOSK_BARCODE_TYPE_CODE93          (TKIOSK_BARCODE_TYPE_UPC_A + 0x07)	//CODE93
#define		TKIOSK_BARCODE_TYPE_CODE128         (TKIOSK_BARCODE_TYPE_UPC_A + 0x08)	//CODE128

/**********************************************************************************************************************
*Hri�����λ��
**********************************************************************************************************************/
#define		TKIOSK_HRI_POSITION_NONE			0x00								//��
#define		TKIOSK_HRI_POSITION_ABOVE			(TKIOSK_HRI_POSITION_NONE + 0x01)	//�ϲ�
#define		TKIOSK_HRI_POSITION_BELOW			(TKIOSK_HRI_POSITION_NONE + 0x02)	//�²�
#define		TKIOSK_HRI_POSITION_BOTH			(TKIOSK_HRI_POSITION_NONE + 0x03)	//��������

/**********************************************************************************************************************
*ҳģʽ��ӡ����ķ���
**********************************************************************************************************************/
#define		TKIOSK_AREA_LEFT_TO_RIGHT			0x00								//����
#define		TKIOSK_AREA_BOTTOM_TO_TOP			(TKIOSK_AREA_LEFT_TO_RIGHT + 0x01)	//�µ���
#define		TKIOSK_AREA_RIGHT_TO_LEFT			(TKIOSK_AREA_LEFT_TO_RIGHT + 0x02)	//�ҵ���
#define		TKIOSK_AREA_TOP_TO_BOTTOM			(TKIOSK_AREA_LEFT_TO_RIGHT + 0x03)	//�ϵ���

/**********************************************************************************************************************
* �ⲿ�ӿں�������
**********************************************************************************************************************/
#ifdef	__cplusplus
extern "C" {
#endif
/**********************************************************************************************************************
* ����:		�򿪴���
* ��ڲ���:	lpName: ������������Ϊ��
*			nComBaudrate: ÿ��λ��, 2400 - 115200
*			nComDataBits: ����λ, 7-8
*			nComStopBits: ֹͣλ, TKIOSK_COM_ONESTOPBIT, TKIOSK_COM_TWOSTOPBITS
*			nComParity: У��λ��TKIOSK_COM_NOPARITY - TKIOSK_COM_SPACEPARITY
*			nFlowControl: ����������, TKIOSK_COM_DTR_DSR - TKIOSK_COM_NO_HANDSHAKE
* ���ڲ���:	��
* ����ֵ: �ɹ����ش򿪶˿ھ��, ʧ�ܷ���INVALID_HANDLE_VALUE
**********************************************************************************************************************/
	HANDLE WINAPI TKIOSK_OpenCom(LPCTSTR lpName, int nComBaudrate, int nComDataBits, int nComStopBits, int nComParity, int nFlowControl);

/**********************************************************************************************************************
* ����:		�رմ���
* ��ڲ���:	hPort: ���������Ϊ�Ǳ���̬��򿪾��
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
**********************************************************************************************************************/
	int WINAPI TKIOSK_CloseCom(HANDLE hPort);

/**********************************************************************************************************************
* ����:		����������
* ��ڲ���:	LPTAddress: ���ڵ�ַ, >0
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_OpenLptByDrv(WORD LPTAddress);

/**********************************************************************************************************************
* ����:		�ر���������
* ��ڲ���:	nPortType: �˿�����, �̶�ΪTKIOSK_LPT
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_CloseDrvLPT(int nPortType);

/**********************************************************************************************************************
* ����:		��USB�ӿ�
* ��ڲ���:	��
* ���ڲ���:	��
* ����ֵ:	�ɹ����ش򿪶˿ھ��, ʧ�ܷ���INVALID_HANDLE_VALUE
**********************************************************************************************************************/
	HANDLE WINAPI TKIOSK_OpenUsb(void);

/**********************************************************************************************************************
* ����:		��USB�ӿ�
* ��ڲ���:	nID: �豸�ڲ�ID��, >0
* ���ڲ���:	��
* ����ֵ:	�ɹ����ش򿪶˿ھ��, ʧ�ܷ���INVALID_HANDLE_VALUE
**********************************************************************************************************************/
	HANDLE WINAPI TKIOSK_OpenUsbByID(int nID);

/**********************************************************************************************************************
* ����:		�ر�USB��
* ��ڲ���:	hPort: ���������Ϊ�Ǳ���̬��򿪾��
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
**********************************************************************************************************************/
	int WINAPI TKIOSK_CloseUsb(HANDLE hPort);

/**********************************************************************************************************************
* ����:		����������
* ��ڲ���:	hPort: ���������Ϊ�Ǳ���̬��򿪾��
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
**********************************************************************************************************************/
	HANDLE WINAPI TKIOSK_OpenDrv(char *drivername);

/**********************************************************************************************************************
* ����:		�ر���������
* ��ڲ���:	hPort: ���������Ϊ�Ǳ���̬��򿪾��
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
**********************************************************************************************************************/
	int WINAPI TKIOSK_CloseDrv(HANDLE hPort);

/**********************************************************************************************************************
* ����:		���ֽڲ���
* ��ڲ���:	PortNumber: �˿ںţ�>0
*			DeviceNumber: �豸�ţ����ڼ�������ȡֵ��Χ��1-4
*			DriverPath: �����ļ�����Ŀ¼, ����Ϊ��
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
			TKIOSK_ERROR_LOADLIBRARY ���ض�̬��ʧ��
**********************************************************************************************************************/
	int	WINAPI TKIOSK_OpenNibblePar(int PortNumber, int DeviceNumber, char *DriverPath);

/**********************************************************************************************************************
* ����:		�ر��ֽڲ���
* ��ڲ���:	��
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
**********************************************************************************************************************/
	int	WINAPI TKIOSK_CloseNibblePar();

/**********************************************************************************************************************
* ����:		�½�һ����ӡ��ҵ
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
**********************************************************************************************************************/
	int WINAPI TKIOSK_StartDoc(HANDLE hPort);

/**********************************************************************************************************************
* ����:		������ӡ��ҵ
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
**********************************************************************************************************************/
	int WINAPI TKIOSK_EndDoc(HANDLE hPort);

/**********************************************************************************************************************
* ����:		���ô��ڳ�ʱ
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nWriteTimeoutMul: д��ʱϵ��, >=0
*			nWriteTimeoutCon: д��ʱ����, >=0
*			nReadTimeoutMul: ����ʱϵ��, >=0
*			nReadTimeoutCon: ����ʱ����, >=0
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_SetComTimeOuts(HANDLE hPort, int nWriteTimeoutMul, int nWriteTimeoutCon, int nReadTimeoutMul, int nReadTimeoutCon);

/**********************************************************************************************************************
* ����:		����USB��ʱ
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			wReadTimeouts: д��ʱ, >=0
*			wWriteTimeouts: ����ʱ, >=0
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_SetUsbTimeOuts(HANDLE hPort,WORD wReadTimeouts, WORD wWriteTimeouts);

/**********************************************************************************************************************
* ����:		�����ֽڲ��ڳ�ʱ
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			wReadTimeouts: д��ʱ, >=0
*			wWriteTimeouts: ����ʱ, >=0
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_SetNibbleParTimeOuts(HANDLE hPort, WORD wReadTimeouts, WORD wWriteTimeouts);

/**********************************************************************************************************************
* ����:		�ֽڲ��ڿ�ʼ�ۼ����ݵ��ڴ�
* ��ڲ���:	��
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
**********************************************************************************************************************/
	int	WINAPI TKIOSK_NibbleParPrintToMemory();

/**********************************************************************************************************************
* ����:		�ֽڲ��ڽ����ۼ����ݣ�����ӡ�ڴ�����
* ��ڲ���:	��
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
**********************************************************************************************************************/
	int	WINAPI TKIOSK_NibbleParFlushMemory();

/**********************************************************************************************************************
* ����:		�������ݵ��˿ڻ��ļ�
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM - TKIOSK_NET
*			pszData: ���ݻ�����, >=0
*			nBytesToWrite: д���ݳ���
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_WriteData(HANDLE hPort, int nPortType, char *pszData, int nBytesToWrite);

/**********************************************************************************************************************
* ����:		��ָ���˿ڶ�ȡ����
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM - TKIOSK_NET
*			pszData: ���ݻ�����, >=0
*			nBytesToWrite: д���ݳ���
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_ReadData(HANDLE hPort, int nPortType, int nStatus, char *pszBuffer,int nBytesToRead);

/**********************************************************************************************************************
* ����:		����ָ���ļ�
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM - TKIOSK_NET
*			filename: �����ļ�·��, ����Ϊ��
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
			TKIOSK_ERROR_INVALID_PATH ·������
**********************************************************************************************************************/
	int WINAPI TKIOSK_SendFile(HANDLE hPort, int nPortType, char *filename);

/**********************************************************************************************************************
* ����:		��ʼ�ѷ��͵����ݱ��浽ָ�����ļ�
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			bToPrinter: �Ƿ��͵���ӡ����־
*			lpFileName: �����ļ�·��, ����Ϊ��
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_BeginSaveToFile(HANDLE hPort, LPCTSTR lpFileName, BOOL bToPrinter);

/**********************************************************************************************************************
* ����:		�����������ݵ��ļ�
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
**********************************************************************************************************************/
	int WINAPI TKIOSK_EndSaveToFile(HANDLE hPort);

/**********************************************************************************************************************
* ����:		��ѯ��ӡ����״̬
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM, TKIOSK_USB, TKIOSK_PARALLEL_LPT, TKIOSK_NET
*			pszStatus: �������ݻ�����, ����Ϊ��
*			nTimeouts: ��ʱʱ��, >=0
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_QueryStatus(HANDLE hPort, int nPortType, char *pszStatus, int nTimeouts);

/**********************************************************************************************************************
* ����:		ʵʱ��ѯ��ӡ����״̬
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM, TKIOSK_USB, TKIOSK_PARALLEL_LPT, TKIOSK_NET
*			pszStatus: �������ݻ�����, ����Ϊ��
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_RTQueryStatus(HANDLE hPort, int nPortType, char *pszStatus);

/**********************************************************************************************************************
* ����:		�Զ�״̬����
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM, TKIOSK_USB, TKIOSK_PARALLEL_LPT, TKIOSK_NET
*			Enable: 1-�����Զ�״̬���أ�0-�ر��Զ�״̬����
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_QueryASB(HANDLE hPort, int nPortType, int Enable);

/**********************************************************************************************************************
* ����:		��ȡ��ǰ dll �ķ����汾��
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			pnMajor: ���汾
*			pnMinor: С�汾
* ���ڲ���:	��
* ����ֵ:	�ɹ���������, ʧ�ܷ���TKIOSK_ERROR_INVALID_PARAMETER
**********************************************************************************************************************/
	int WINAPI TKIOSK_GetVersionInfo(int *pnMajor, int *pnMinor);

/**********************************************************************************************************************
* ����:		��λ��ӡ��
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_Reset(HANDLE hPort, int nPortType);

/**********************************************************************************************************************
* ����:		ѡ��ֽ������
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			nMode: TKIOSK_PAPER_SERIALΪ����ֽ, TKIOSK_PAPER_SIGNΪ���ֽ
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_SetPaperMode(HANDLE hPort,int nPortType,int nMode);

/**********************************************************************************************************************
* ����:		ѡ��ֽ������
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			nPrintMode: KIOSK_PRINT_MODE_STANDARD-��׼ģʽ, KIOSK_PRINT_MODE_PAGE-ҳģʽ
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_SetMode(HANDLE hPort,int nPortType,int nPrintMode);

/**********************************************************************************************************************
* ����:		�����ַ����и�
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			nDistance: �иߣ�0-255
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_SetLineSpacing(HANDLE hPort,int nPortType, int nDistance);

/**********************************************************************************************************************
* ����:		�����ַ����Ҽ��
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			nDistance: �Ҽ�࣬0-255
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_SetRightSpacing(HANDLE hPort,int nPortType,int nDistance);

/**********************************************************************************************************************
* ����:		������Դ�ӡλ��
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			nHorizontalDist: �������λ�ã�0-65535
*			nVerticalDist: �������λ�ã�0-65535
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_SetOppositePosition(HANDLE hPort,int nPortType,int nPrintMode,int nHorizontalDist,int nVerticalDist);

/**********************************************************************************************************************
* ����:		��������λ��
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			pszPosition: λ����Ϣ������Ϊ��
*			nCount: ������0 <= nCount <= 32
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_SetTabs(HANDLE hPort, int nPortType, char *pszPosition, int nCount);

/**********************************************************************************************************************
* ����:		ִ���������
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_ExecuteTabs(HANDLE hPort,int nPortType);

/**********************************************************************************************************************
* ����:		����λͼ��RAM
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			pszPaths: λͼ�ļ�·��, ����Ϊ��
*			nTranslateMode��ת����ʽ��1-2
*			nID���洢ID, 0-7
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
			TKIOSK_ERROR_INVALID_PATH ·������
			TKIOSK_ERROR_NOT_BITMAP	����λͼ
			TKIOSK_ERROR_BEYOND_AREA λͼ����
**********************************************************************************************************************/
	int WINAPI TKIOSK_PreDownloadBmpToRAM(HANDLE hPort,int nPortType, char *pszPaths, int nTranslateMode, int nID);

/**********************************************************************************************************************
* ����:		����λͼ��RAM
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			pszPaths[]: λͼ�ļ�·������, ����Ϊ��
*			nTranslateMode��ת����ʽ��1-2
*			nCount: ��������, 1 <= nCount <= 255
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
			TKIOSK_ERROR_INVALID_PATH ·������
			TKIOSK_ERROR_NOT_BITMAP	����λͼ
			TKIOSK_ERROR_BEYOND_AREA λͼ����
**********************************************************************************************************************/
	int WINAPI TKIOSK_PreDownloadBmpToFlash(HANDLE hPort, int nPortType, char *pszPaths[], int nTranslateMode, int nCount);

/**********************************************************************************************************************
* ����:		ѡ������ַ����ʹ���ҳ
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			nCharSet: ѡ���ַ���, 0 <= nCharSet <= 13
*			nCodePage: ѡ�����ҳ, 0 <= nCodePage <= 5��16 <= nCodePage <= 19
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_SetCharSetAndCodePage(HANDLE hPort,int nPortType,int nCharSet,int nCodePage);

/**********************************************************************************************************************
* ����:		��ǰ��ֽһ��
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_FeedLine(HANDLE hPort, int nPortType);

/**********************************************************************************************************************
* ����:		��ӡ����ǰ��ֽn��
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			nLines: ��ֽ����, 0-255
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_FeedLines(HANDLE hPort,int nPortType,int nLines);

/**********************************************************************************************************************
* ����:		����һ����͵���ӡλ��
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			nLines: ��ֽ����, 0-255
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_MarkerFeedPaper(HANDLE hPort, int nPortType);

/**********************************************************************************************************************
* ����:		��ֽ
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			nMode: 0-ʹ�����������ӡʱ��ҳ���С���趨��ֽ����, 1-��ֽ�������nDistanceȷ��
*			nDistance: 0-255
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_CutPaper(HANDLE hPort,int nPortType, int nMode, int nDistance);

/**********************************************************************************************************************
* ����:		��׼ģʽ��������߾�ʹ�ӡ������
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			nDistance: ��߾࣬0 <= nDistance <= 65535
*			nWidth: ��ӡ�����ȣ�0 <= nWidth <= 65535
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_S_SetLeftMarginAndAreaWidth(HANDLE hPort,int nPortType,int nDistance,int nWidth);

/**********************************************************************************************************************
* ����:		��׼ģʽ�������ַ��Ķ���ģʽ
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			nMode: ��߾࣬0-2
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_S_SetAlignMode(HANDLE hPort, int nPortType, int nMode);

/**********************************************************************************************************************
* ����:		�ѽ�Ҫ��ӡ���ַ������ݷ��͵���ӡ��������
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			pszData: ����, ����Ϊ��
*			nWidthTimes: ����Ŵ���, 1-6
*			nHeightTimes: ����Ŵ�����1-6
*			nFontType: �������ͷ��0-3
*			nFontStyle��������0-1F88
*			nOrgx:����λ��0-65535
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_S_Textout(HANDLE hPort, int nPortType,char *pszData, int nOrgx, int nWidthTimes,     
								int nHeightTimes, int nFontType, int nFontStyle);

/**********************************************************************************************************************
* ����:		���ز���ӡλͼ
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			pszPath: λͼ·��, ����Ϊ��
*			nTranslateMode: ����ģʽ, 1-2
*			nMode: ��ӡģʽ��TKIOSK_BITMAP_MODE_8SINGLE_DENSITY��TKIOSK_BITMAP_MODE_8DOUBLE_DENSITY
*							 TKIOSK_BITMAP_MODE_24SINGLE_DENSITY��TKIOSK_BITMAP_MODE_24DOUBLE_DENSITY
*			nOrgx:����λ��0-65535
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_S_DownloadPrintBmp(HANDLE hPort, int nPortType, char *pszPath, 
										int nTranslateMode, int nOrgx, int nMode);

/**********************************************************************************************************************
* ����:		��ӡ��������RAM�е�λͼ
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			nID: �ڲ�ID, 0-7
*			nMode: ��ӡģʽ��TKIOSK_BITMAP_PRINT_NORMAL- TKIOSK_BITMAP_PRINT_QUADRUPLE
*			nOrgx:����λ��0-65535
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int  WINAPI TKIOSK_S_PrintBmpInRAM(HANDLE hPort,int nPortType,int nID, int nOrgx, int nMode);

/**********************************************************************************************************************
* ����:		��ӡ��������Flash�е�λͼ
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			nID: �ڲ�ID, 1-255
*			nMode: ��ӡģʽ��TKIOSK_BITMAP_PRINT_NORMAL- TKIOSK_BITMAP_PRINT_QUADRUPLE
*			nOrgx:����λ��0-65535
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_S_PrintBmpInFlash(HANDLE hPort, int nPortType, int nID, int nOrgx, int nMode);

/**********************************************************************************************************************
* ����:		���ô�ӡ����
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			pszBuffer:��������, ����Ϊ��
*			nOrgx:�������ʼ������꣬0<=nOrgx<=65535
*			nType:�������ͣ�TKIOSK_BARCODE_TYPE_UPC_A<=nType<=TKIOSK_BARCODE_TYPE_CODE128
*			nWidth:����Ԫ�صĿ�ȣ�2<=nWidth<=6
*			nHeight:����Ԫ�صĸ߶ȣ�1<=nWidth<=255
*			nHriFontType:Hri�����ģʽ��nHriFontType=0��1
*			nHriFontPosition:Hri����λ�ã�0<=nHriFontPosition<=3
*			nBytesOfBuffer:�������ݸ���, �����������й�
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_S_PrintBarcode(HANDLE hPort, int nPortType, char *pszBuffer, int nOrgx, int nType, 
									int nWidth, int nHeight, int nHriFontType, int nHriFontPosition, int nBytesOfBuffer);

/**********************************************************************************************************************
* ����:		����ҳ��Ĵ�ӡ������ʼ����
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			nOrgx: ��ʼ������꣬0<=nOrgx<=65535
*			nOrgy: ��ʼ�������꣬0<=nOrgy<=65535
*			nWidth: ��ӡ����Ŀ�ȣ�0<=nWidth<=65535
*			nHeight: ��ӡ����ĸ߶ȣ�0<=nHeight<=65535
*			nDirection: ��ӡ����TKIOSK_AREA_LEFT_TO_RIGHT-TKIOSK_AREA_TOP_TO_BOTTOM
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_P_SetAreaAndDirection(HANDLE hPort,int nPortType,int nOrgx, int nOrgy,        
											int nWidth, int nHeight, int nDirection);

/**********************************************************************************************************************
* ����:		�ѽ�Ҫ��ӡ���ַ������ݷ��͵���ӡ��������
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			pszData: ����, ����Ϊ��
*			nWidthTimes: ����Ŵ���, 1-6
*			nHeightTimes: ����Ŵ�����1-6
*			nFontType: �������ͷ��TKIOSK_FONT_TYPE_STANDARD - TKIOSK_FONT_TYPE_CHINESE
*			nFontStyle��������0-1F88
*			nOrgx:����λ��0-65535
*			nOrgy:����λ��0-65535
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_P_Textout(HANDLE hPort,int nPortType, char *pszData, int nOrgx, int nOrgy,          
								int nWidthTimes, int nHeightTimes, int nFontType, int nFontStyle);

/**********************************************************************************************************************
* ����:		���ز���ӡλͼ
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			pszPath: λͼ·��, ����Ϊ��
*			nTranslateMode: ����ģʽ, 1-2
*			nMode: ��ӡģʽ��TKIOSK_BITMAP_MODE_8SINGLE_DENSITY��TKIOSK_BITMAP_MODE_8DOUBLE_DENSITY
*							 TKIOSK_BITMAP_MODE_24SINGLE_DENSITY��TKIOSK_BITMAP_MODE_24DOUBLE_DENSITY
*			nOrgx:����λ��0-65535
*			nOrgy:����λ��0-65535
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_P_DownloadPrintBmp(HANDLE hPort, int nPortType,char *pszPath,
								int nTranslateMode, int nOrgx,int nOrgy, int nMode);

/**********************************************************************************************************************
* ����:		��ӡ��������RAM�е�λͼ
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			nID: �ڲ�ID, 0-7
*			nMode: ��ӡģʽ��TKIOSK_BITMAP_PRINT_NORMAL- TKIOSK_BITMAP_PRINT_QUADRUPLE
*			nOrgx:����λ��0-65535
*			nOrgy:����λ��0-65535
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_P_PrintBmpInRAM(HANDLE hPort,int nPortType, int nID, int nOrgx, int nOrgy, int nMode);

/**********************************************************************************************************************
* ����:		��ӡ��������Flash�е�λͼ
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			nID: �ڲ�ID, 1-255
*			nMode: ��ӡģʽ��TKIOSK_BITMAP_PRINT_NORMAL- TKIOSK_BITMAP_PRINT_QUADRUPLE
*			nOrgx:����λ��0-65535.
*			nOrgy:����λ��0-65535
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_P_PrintBmpInFlash(HANDLE hPort, int nPortType, int nID, int nOrgx, int nOrgy, int nMode);

/**********************************************************************************************************************
* ����:		���ô�ӡ����
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			pszBuffer:��������, ����Ϊ��
*			nOrgx:�������ʼ������꣬0<=nOrgx<=65535
*			nOrgy:�������ʼ������꣬0<=nOrgy<=65535
*			nType:�������ͣ�TKIOSK_BARCODE_TYPE_UPC_A<=nType<=TKIOSK_BARCODE_TYPE_CODE128
*			nWidth:����Ԫ�صĿ�ȣ�2<=nWidth<=6
*			nHeight:����Ԫ�صĸ߶ȣ�1<=nWidth<=255
*			nHriFontType:Hri�����ģʽ��nHriFontType=0��1
*			nHriFontPosition:Hri����λ�ã�0<=nHriFontPosition<=3
*			nBytesOfBuffer:�������ݸ���, �����������й�
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_P_PrintBarcode(HANDLE hPort, int nPortType, char *pszBuffer, int nOrgx, int nOrgy, int nType, 
									int nWidth, int nHeight, int nHriFontType, int nHriFontPosition, int nBytesOfBuffer);

/**********************************************************************************************************************
* ����:		��ӡҳ�������ڵ�����
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_P_Print(HANDLE hPort,int nPortType);

/**********************************************************************************************************************
* ����:		ҳģʽ����ջ�����
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_P_Clear(HANDLE hPort,int nPortType);

/**********************************************************************************************************************
* ����:		ִ�в��Դ�ӡ
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_S_TestPrint(HANDLE hPort, int nPortType);

/**********************************************************************************************************************
* ����:		���ô�ӡ��ʼλ��������(��׼ģʽ����Ч)
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			nMode: 0-�������ӡ���������������ݺ����ô�ӡ��ʼλ��������
*				   1-��ӡ�껺�������������ݺ����ô�ӡ��ʼλ��������
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_SetPrintFromStart(HANDLE hPort, int nPortType, int nMode);

/**********************************************************************************************************************
* ����:		��ӡ��դ
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			pszBmpPath: ��դ·��������Ϊ��
*			nTranslateMode: 1-2
*			nMode: TKIOSK_BITMAP_PRINT_NORMAL-TKIOSK_BITMAP_PRINT_QUADRUPLE
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_SetRaster(HANDLE hPort,int nPortType, char *pszBmpPath, int nTranslateMode, int nMode);

/**********************************************************************************************************************
* ����:		���ú���ģʽ
* ��ڲ���:	hPort:���������Ϊ�Ǳ���̬��򿪾��
*			nPortType: �˿�����, TKIOSK_COM-TKIOSK_NET
*			nEnable����ѡ��/ȡ������ģʽ��nEnable= 0��1
*			nBigger=0��������С��nBigger=1�����ַŴ�
*			nLSpacing: �������࣬0<=nLSpacing<=255
*			nRSpacing: �����Ҽ�࣬0<=nRSpacing<=255
*			nUnderLine=0�����»��ߣ�nUnderLine=1��һ����»��ߣ�nUnderLine=2����»���
* ���ڲ���:	��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL  ����ʧ��
			TKIOSK_ERROR_INVALID_HANDLE �����Ч
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_SetChineseFont(HANDLE hPort,int nPortType,char *pszBuffer,int nEnable,
								int nBigger,int nLSpacing,int nRSpacing,int nUnderLine);

/**********************************************************************************************************************
* ����:		ö�������ӡ��
* ��ڲ���:	�� 
* ���ڲ���:	iplist: �����п�������ӡ��IP�б���ͬIP����'@'�ָ����Ϊ�գ������㹻��
*			Number: ������ӡ�������� ����Ϊ��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL ����ʧ��
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_EnumNetPrinter(char *iplist, int *Number);

/**********************************************************************************************************************
* ����:		ö��������ӡ��
* ��ڲ���:	�� 
* ���ڲ���:	Drivername: PC��װ�������ƣ���ͬ���Ƽ���'@'�ָ����Ϊ�գ������㹻��
*			Number: PC��װ��������������Ϊ��
*			KeyWord: ������Ϣ������Ϊ��
* ����ֵ:	�ɹ�����TKIOSK_SUCCESS, ʧ�ܷ�������ֵ��
			TKIOSK_FAIL ����ʧ��
			TKIOSK_ERROR_INVALID_PARAMETER ��������
**********************************************************************************************************************/
	int WINAPI TKIOSK_EnumDrvPrinter(char *Drivername, int *Number, char *KeyWord);
#ifdef	__cplusplus
}
#endif
#endif